// Tutorial here:
// https://youtu.be/IF6k0uZuypA
// made some tweaks to due to findDOMnode deprecation complaint and some things didn't actually work at all from the sample code

import "./NavBar.css";
import { ReactComponent as CaretIcon } from "./icons/caret.svg";
import { ReactComponent as ArrowIcon } from "./icons/arrow.svg";
import { ReactComponent as PlusIcon } from "./icons/plus.svg";
import { ReactComponent as BellIcon } from "./icons/bell.svg";
import { ReactComponent as MessengerIcon } from "./icons/messenger.svg";
import { ReactComponent as CogIcon } from "./icons/cog.svg";
import { ReactComponent as ChevronIcon } from "./icons/chevron.svg";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

function NavMenu() {
  return (
    <NavBar>
      <NavItem icon={<PlusIcon />} />
      <NavItem icon={<BellIcon />} />
      <NavItem icon={<MessengerIcon />} />
      <NavItem icon={<CaretIcon />} menu={true} />
    </NavBar>
  );
}

function NavBar({ children }) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{children}</ul>
    </nav>
  );
}

function NavItem({ icon, menu }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {icon}
      </a>
      {open && menu && <DropdownMenu setOpen={setOpen}/>}
    </li>
  );
}

function DropdownMenu({ setOpen }) {
  const [ activeMenu, setActiveMenu] = useState("main");
  const [ menuHeight, setMenuHeight] = useState(null);
  const dropDownRef = useRef(null);
  const menuMainRef = useRef(null);
  const menuSecondaryRef = useRef(null);

  useEffect(() => {
    const handleOuterClick = (event) => {
      // had to do some head scratching with this
      // couldn't use document.activeElement.contains(ref)
      // ... for some reason
      if (!event.path.includes(dropDownRef.current)) setOpen(false);
    }
    document.addEventListener('click', handleOuterClick);
    return (() => document.removeEventListener('click', handleOuterClick));
  }, []);

  useEffect(() => {
    onEnter();
  }, []);

  function onEnter() {
    const el = (activeMenu === 'main') ? menuMainRef : menuSecondaryRef;
    const height = el.current.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem({ leftIcon, rightIcon, children, goToMenu }) {
    return (
      <a
        href="#"
        className="menu-item"
        onClick={() => goToMenu && setActiveMenu(goToMenu)}
      >
        <span className="icon-button">{leftIcon}</span>
        {children}
        <span className="icon-right">{rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{height: menuHeight}} ref={dropDownRef}>
      <CSSTransition
        nodeRef={menuMainRef}
        in={activeMenu === "main"}
        unmountOnExit
        timeout={500}
        classNames="menu-primary"
        onEnter={onEnter}
      >
        <div className="menu" ref={menuMainRef}>
          <DropdownItem>
            {"My Profile"}
          </DropdownItem>
          <DropdownItem
            leftIcon={<CogIcon />}
            rightIcon={<ChevronIcon />}
            goToMenu={"settings"}
          >
            {"Settings"}
          </DropdownItem>
        </div>
      </CSSTransition>

      <CSSTransition
        nodeRef={menuSecondaryRef}
        in={activeMenu === "settings"}
        unmountOnExit
        timeout={500}
        classNames="menu-secondary"
        onEnter={onEnter}
      >
        <div className="menu" ref={menuSecondaryRef}>
          <DropdownItem
            leftIcon={<ArrowIcon />}
            goToMenu={"main"}
          ></DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>
            {"Settings"}
          </DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>
            {"Settings"}
          </DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>
            {"Settings"}
          </DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>
            {"Settings"}
          </DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>
            {"Settings"}
          </DropdownItem>
          <DropdownItem leftIcon={<CogIcon />}>
            {"Settings"}
          </DropdownItem>
        </div>
      </CSSTransition>
    </div>
  );
}

export default NavMenu;
