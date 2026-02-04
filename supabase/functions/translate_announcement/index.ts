// supabase/functions/translate_announcement/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  // Supabase CLI disallows secrets that start with SUPABASE_, so support both names.
  const supabaseUrl =
    Deno.env.get('SUPABASE_URL') ?? Deno.env.get('EV_SUPABASE_URL')
  const supabaseServiceRoleKey =
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ??
    Deno.env.get('EV_SERVICE_ROLE_KEY')
  const groqApiKey = Deno.env.get('GROQ_API_KEY')

  if (!supabaseUrl || !supabaseServiceRoleKey || !groqApiKey) {
    return new Response(JSON.stringify({ error: 'Missing env configuration' }), { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  try {
    const { announcement_id, target_language = 'en' } = await req.json()

    if (!announcement_id) {
      return new Response(JSON.stringify({ error: 'announcement_id is required' }), { status: 400 })
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .select('id, title, message, language, updated_at, created_at')
      .eq('id', announcement_id)
      .single()

    if (error || !announcement) {
      return new Response(JSON.stringify({ error: 'Announcement not found' }), { status: 404 })
    }

    const sourceLanguage = (announcement.language || '').toLowerCase()
    if (sourceLanguage === target_language) {
      return new Response(JSON.stringify({ ok: true, skipped: true }))
    }

    const prompt = `Translate the following announcement into clear, natural English.
Return ONLY valid JSON with keys "title" and "message". No extra text.

Title: ${announcement.title || ''}
Message: ${announcement.message || ''}`

    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 300,
      }),
    })

    if (!groqResponse.ok) {
      const errText = await groqResponse.text()
      return new Response(JSON.stringify({ error: `Groq error: ${errText}` }), { status: 502 })
    }

    const groqData = await groqResponse.json()
    const content = groqData?.choices?.[0]?.message?.content || ''
    const match = content.match(/\{[\s\S]*\}/)
    if (!match) {
      return new Response(JSON.stringify({ error: 'Invalid translation response' }), { status: 502 })
    }

    const parsed = JSON.parse(match[0])
    const translatedTitle = parsed.title || announcement.title
    const translatedMessage = parsed.message || announcement.message

    const { error: upsertError } = await supabase
      .from('announcement_translations')
      .upsert({
        announcement_id: announcement.id,
        language: target_language,
        title: translatedTitle,
        message: translatedMessage,
      }, { onConflict: 'announcement_id,language' })

    if (upsertError) {
      return new Response(JSON.stringify({ error: 'Failed to upsert translation' }), { status: 500 })
    }

    return new Response(JSON.stringify({ ok: true }))
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', details: String(e) }), { status: 500 })
  }
})
