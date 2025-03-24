import Link from "next/link";

export default function Home() {
  return (
      <div className={'main'}>
        <button>

        </button>
        <Link href={'/SignIn'}>
          <button>SignIn</button>
        </Link>
      </div>
  )
}
