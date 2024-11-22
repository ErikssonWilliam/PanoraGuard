import userIcon from "../assets/user-01.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex flex-wrap gap-5 justify-between self-end w-full text-xl font-medium tracking-wide leading-none text-white whitespace-nowrap max-w-[1218px] max-md:mr-2.5 max-md:max-w-full">
      <div className="self-start mt-3.5">panoraGuard</div>
      <Link to="/profile">
        <img
          loading="lazy"
          src={userIcon}
          alt=""
          className="object-contain shrink-0 aspect-square w-[37px]"
        />
      </Link>
    </header>
  );
}

export default Header;
