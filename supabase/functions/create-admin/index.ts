import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authorization = request.headers.get('Authorization');
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!token) return jsonResponse({ error: 'Unauthorized' }, 401);
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase Edge Function environment is incomplete.');
    return jsonResponse({ error: 'Server configuration is missing' }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profileError) {
      console.error('Could not verify admin profile:', profileError.message);
      return jsonResponse({ error: 'Could not verify administrator access' }, 500);
    }
    if (profile.role !== 'superadmin') {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }

    const payload: unknown = await request.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }
    const body = payload as Record<string, unknown>;
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const temporaryPassword = typeof body.temporaryPassword === 'string' ? body.temporaryPassword : '';
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || temporaryPassword.length < 8
      || fullName.length === 0
      || fullName.length > 120
    ) {
      return jsonResponse({ error: 'Provide a valid email, a password of at least 8 characters, and a name.' }, 400);
    }

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (createError || !created.user) {
      return jsonResponse({ error: createError?.message || 'Could not create the account.' }, 400);
    }

    const { data: updatedProfile, error: roleError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', created.user.id)
      .select('id')
      .single();
    if (roleError || !updatedProfile) {
      console.error('Could not assign admin role:', roleError?.message || 'Profile update returned no row');
      const { error: cleanupError } = await supabase.auth.admin.deleteUser(created.user.id);
      if (cleanupError) console.error('Could not remove incomplete account:', cleanupError.message);
      return jsonResponse({ error: 'Could not finish setting up the admin account.' }, 500);
    }

    return jsonResponse({
      user: { id: created.user.id, email, fullName, role: 'admin' },
    }, 201);
  } catch (error) {
    console.error('Admin account creation failed:', error);
    return jsonResponse({ error: 'Could not create the admin account.' }, 500);
  }
});
