import { customAlphabet } from 'nanoid';
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import styles from '../styles/Home.module.css'

const maxLength = 40;
const maxQuantity = 1000;

export default function Home() {

	const [alphabet, setAlphabet] = useState('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-');
	const [length, setLength] = useState(21);
	const [quantity, setQuantity] = useState(1);
	const [error, setError] = useState('');
	const [ids, setIds] = useState([]);

	useEffect(() => {

		if(typeof window === 'undefined')
			return;

		const idsLength = Number(length);

		if(!Number.isSafeInteger(idsLength) || idsLength < 1) {
			setError(`Invalid ID length ${length}`);
			setIds([]);
			return;
		}

		if(idsLength > maxLength) {
			setError(`You cannot generate IDs of more than ${maxLength} characters`);
			setIds([]);
			return;
		}

		const idsQuantity = Number(quantity);

		if(!Number.isSafeInteger(idsQuantity) || idsQuantity < 1) {
			setError(`Invalid ID quantity ${quantity}`);
			setIds([]);
			return;
		}

		if(idsQuantity > maxQuantity) {
			setError(`You cannot generate more than ${maxQuantity} IDs at once`);
			setIds([]);
			return;
		}

		const nanoid = customAlphabet(alphabet, idsLength);

		const generatedIds = Array.from(Array(idsQuantity)).map(() => nanoid());

		setError('');
		setIds(generatedIds);

	}, [alphabet, length, quantity]);

	return (
		<div className={styles.container}>
			<Head>
				<title>Nano ID generator</title>
				<meta name="description" content="An online tool to generate IDs using nanoid" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>
					<a href="https://www.npmjs.com/package/nanoid">Nano ID</a> generator
				</h1>

				<p className={styles.description}>
					Easily generate unique IDs on the browser
				</p>

				<div className={styles.grid}>

					<div className={styles.fullWidthCard}>
						<h2>Alphabet</h2>
						<input
							name="alphabet"
							value={alphabet}
							onChange={e => setAlphabet(e.target.value)}
						/>
					</div>

					<div className={styles.card}>
						<h2>Length</h2>
						<input
							name="length"
							value={length}
							onChange={e => setLength(e.target.value)}
							type="number"
							step="1"
							min="1"
						/>
					</div>

					<div className={styles.card}>
						<h2>Quantity</h2>
						<input
							name="quantity"
							value={quantity}
							onChange={e => setQuantity(e.target.value)}
							type="number"
							step="1"
							min="1"
						/>
					</div>

					<div
						className={styles.fullWidthCard}
					>
						<h2>IDs</h2>
						{
							error || (
								<ul>
									{ids.map(id => (
										<li key={id}>
											<span className={styles.monospace}>{id}</span>
										</li>
									))}
								</ul>
							)
						}
					</div>

				</div>
			</main>

			<footer className={styles.footer}>
				<a
					href="https://github.com/jormaechea"
					target="_blank"
					rel="noopener"
				>
					Powered by{' '}
					<span className={styles.logo}>
						<Image src="/github.svg" alt="Github Logo" width={16} height={16} />
					</span>
					{' '}@jormaechea
				</a>
			</footer>
		</div>
	)
}
