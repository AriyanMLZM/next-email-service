'use client'

import { useState } from 'react'

// Define your quiz questions here
const QUIZ_QUESTIONS = [
	{
		id: 'q1',
		question: 'How did you hear about us?',
		options: ['Google Search', 'Social Media', 'Friend Referral', 'Other'],
	},
	{
		id: 'q2',
		question: 'What is your budget range?',
		options: [
			'Under $1,000',
			'$1,000 - $5,000',
			'$5,000 - $10,000',
			'Over $10,000',
		],
	},
	{
		id: 'q3',
		question: 'How soon do you need this project?',
		options: ['ASAP', 'Within 1 month', '1-3 months', 'Just exploring'],
	},
]

export default function Home() {
	const [status, setStatus] = useState('')

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setStatus('Sending...')

		const formData = new FormData(e.currentTarget)

		// Collect quiz answers into a structured array
		const quizAnswers = QUIZ_QUESTIONS.map((q) => ({
			question: q.question,
			answer: (formData.get(q.id) as string) || 'Not answered',
		}))

		const payload = {
			name: formData.get('name'),
			email: formData.get('email'),
			message: formData.get('message'),
			quizAnswers,
		}

		const res = await fetch('/api/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		})

		if (res.ok) {
			setStatus('Email sent! Check your Resend Dashboard.')
			;(e.target as HTMLFormElement).reset()
		} else {
			setStatus('Failed to send. Check the console.')
		}
	}

	return (
		<main
			style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '500px' }}
		>
			<h1>Contact Us</h1>
			<form
				onSubmit={handleSubmit}
				style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
			>
				<div>
					<label htmlFor="name">Name</label>
					<br />
					<input
						id="name"
						name="name"
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<br />
					<input
						id="email"
						name="email"
						type="email"
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>
				<div>
					<label htmlFor="message">Message</label>
					<br />
					<textarea
						id="message"
						name="message"
						required
						style={{ width: '100%', padding: '0.5rem' }}
					/>
				</div>

				<hr />
				<h2>Quick Questions</h2>

				{QUIZ_QUESTIONS.map((q) => (
					<fieldset
						key={q.id}
						style={{
							border: '1px solid #ccc',
							padding: '1rem',
							borderRadius: '4px',
						}}
					>
						<legend style={{ fontWeight: 'bold' }}>{q.question}</legend>
						{q.options.map((option) => (
							<label
								key={option}
								style={{ display: 'block', marginTop: '0.5rem' }}
							>
								<input type="radio" name={q.id} value={option} required />{' '}
								{option}
							</label>
						))}
					</fieldset>
				))}

				<button
					type="submit"
					style={{ padding: '0.75rem', cursor: 'pointer', fontSize: '1rem' }}
				>
					Send Message
				</button>
			</form>
			{status && <p style={{ marginTop: '1rem' }}>{status}</p>}
		</main>
	)
}
