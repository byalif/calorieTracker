import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/Profile.module.css";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.cont}>
      <div className={styles.clickCont}>
        <div className={styles.nut}>Nutrition Tracker.</div>
        <div className={styles.click}>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            href="/register"
          >
            Get Started today!
          </Link>
        </div>
      </div>
    </div>
  );
}
