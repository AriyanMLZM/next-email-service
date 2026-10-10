import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
	try {
		const { name, email, message, quizAnswers } = await request.json()

		// Format quiz answers into a readable HTML list
		const quizHtml = quizAnswers
			.map(
				(qa: { question: string; answer: string }) =>
					`<li><strong>${qa.question}:</strong> ${qa.answer}</li>`,
			)
			.join('')

		const { data, error } = await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>', // Replace with your verified sender
			to: ['delivered@resend.dev'], // Replace with your Resend receiving address
			subject: `New message from ${name}`,
			html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <hr />
        <h3>Quiz Answers</h3>
        <ul>
          ${quizHtml}
        </ul>
      `,
		})

		if (error) {
			return NextResponse.json({ error }, { status: 500 })
		}

		return NextResponse.json({ success: true, data })
	} catch (error) {
		return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
	}
}
