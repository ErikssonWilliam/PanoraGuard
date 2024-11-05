import React from 'react';

function Header() {
  return (
    <header className="flex flex-wrap gap-5 justify-between self-end w-full text-xl font-medium tracking-wide leading-none text-white whitespace-nowrap max-w-[1218px] max-md:mr-2.5 max-md:max-w-full">
      <div className="self-start mt-3.5">panoraGuard</div>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8b7ac0a8a09afb6e24c373f746cae9c3be462c3e5e92c6aacfac9ced1dd06cf?apiKey=b098bcbfae4a413cac7bdf6cae526d40&" alt="" className="object-contain shrink-0 aspect-square w-[37px]" />
    </header>
  );
}

export default Header;