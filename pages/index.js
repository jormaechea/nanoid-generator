import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { customAlphabet } from 'nanoid';
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { EVENTS, logEvent } from '../lib/analytics';

const minLength = 3;
const maxLength = 40;
const maxQuantity = 1000;

const INITIAL_VALUES = {
	alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-',
	length: 21,
	quantity: 1
};

const Home = ({
	alphabet: initialAlphabet,
	length: initialLength,
	quantity: initialQuantity
}) => {

	const router = useRouter();

	const [alphabet, setAlphabet] = useState(initialAlphabet);
	const [length, setLength] = useState(initialLength);
	const [quantity, setQuantity] = useState(initialQuantity);

	const [error, setError] = useState('');
	const [ids, setIds] = useState([]);

	const [justCopied, setJustCopied] = useState('');
	const [justCopiedTimer, setJustCopiedTimer] = useState(null);

	const canReset = () => alphabet !== INITIAL_VALUES.alphabet
		|| length !== INITIAL_VALUES.length
		|| quantity !== INITIAL_VALUES.quantity;

	const resetVariables = () => {
		setAlphabet(INITIAL_VALUES.alphabet);
		setLength(INITIAL_VALUES.length);
		setQuantity(INITIAL_VALUES.quantity);
	};

	const copyToClipboard = async (key, text) => {
		if(!window.navigator || !window.navigator.clipboard)
			return;

		await window.navigator.clipboard.writeText(text);

		if(justCopiedTimer)
			clearTimeout(justCopiedTimer);

		setJustCopied(key);
		setJustCopiedTimer(setTimeout(() => setJustCopied(''), 1000));
	};

	const copyUrl = async () => {
		copyToClipboard('url', window.location.href);
	};

	const copyIds = async () => {
		copyToClipboard('ids', ids.join('\n'));
	}

	const copyId = async (key, id) => {
		copyToClipboard(key, id);
	}

	useEffect(() => {

		if(typeof window === 'undefined')
			return;

		const idsLength = Number(length);

		if(!Number.isSafeInteger(idsLength) || idsLength < 1) {
			setError(`Invalid ID length ${length}`);
			setIds([]);
			return;
		}

		if(idsLength < minLength) {
			setError(`You cannot generate IDs of less than ${minLength} characters`);
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

		logEvent(EVENTS.IDS_GENERATED, {
			alphabet,
			length,
			quantity
		});

		setError('');
		setIds(generatedIds);

		router.replace({
			query: {
				...(alphabet !== INITIAL_VALUES.alphabet && { alphabet }),
				...(idsLength !== INITIAL_VALUES.length && { length: idsLength }),
				...(idsQuantity !== INITIAL_VALUES.quantity && { quantity: idsQuantity })
			}
		}, undefined, {
			scroll: false,
			shallow: true
		});

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

					<div className={`${styles.card} ${styles.cardSuperWidth}`}>
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

					<div className={`${styles.card} ${styles.cardSuperWidth}`}>
						<h2>IDs</h2>
						{
							error || (
								<ul>
									{ids.map((id, idx) => (
										<li key={`${id}-${idx}`}>
											<code className={styles.monospace}>{id}</code>
											<button className={styles.idCopy} onClick={() => copyId(`${id}-${idx}`, id)}>📋 {justCopied === `${id}-${idx}` ? 'Copied!' : 'Copy'}</button>
										</li>
									))}
								</ul>
							)
						}
					</div>

					<div className={`${styles.card} ${styles.cardDoubleWidth}`}>
						<h2>Actions</h2>
						<input
							type="button"
							className={styles.action}
							value={justCopied === 'url' ? 'Copied!' : '🔗 Copy current URL'}
							onClick={copyUrl}
						/>
						{ids.length > 1 ? <input
							type="button"
							className={styles.action}
							value={justCopied === 'ids' ? 'Copied!' : '📋 Copy all IDs'}
							onClick={copyIds}
						/> : null}
						{canReset() ? <input
							type="button"
							className={styles.action}
							value="Reset generator"
							onClick={resetVariables}
						/> : null}
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
};

Home.getInitialProps = ctx => {
	return {
		alphabet: ctx.query.alphabet || INITIAL_VALUES.alphabet,
		length: ctx.query.length || INITIAL_VALUES.length,
		quantity: ctx.query.quantity || INITIAL_VALUES.quantity
	};
};

export default Home;
