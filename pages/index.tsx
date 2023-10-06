import Head from "next/head";
import Image from "next/image";

import GuessForm from "../components/GuessForm";
import styles from "@/pages/index.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Guess My Breed</title>
        <link rel="icon" href="/dog-emoji.png" />
      </Head>

      <main>
        <h1 className={styles.title}>Guess My Breed</h1>

        <p className={styles.description}>Can you guess what my breed is?</p>

        <div className={styles.grid}>
          <GuessForm />
        </div>
      </main>

      <footer className="bg-gray-200 py-4 px-8 flex items-center justify-center fixed bottom-0 w-full">
        <a
          href="https://github.com/huytran-wq"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>
            <Image
              src="/github-logo.png"
              alt="GitHub Logo"
              width={72}
              height={16}
            />
          </span>
        </a>
      </footer>
    </div>
  );
}
