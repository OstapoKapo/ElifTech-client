import './page.scss';
import Link from "next/link";

const Home = () =>  {
  return (
   <div className={'main'}>
       <button className={'main__btn'}>Log In</button>
       <Link href="/SignIn">
           <button className={'main__btn'}>Sign In</button>
       </Link>
   </div>
  );
}

export default Home;
