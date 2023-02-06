import { useNavigate } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import { toastr } from 'react-redux-toastr';
import { ReactComponent as Logo } from './logo.svg';
import { UserSlice } from '../../store';
import { Pages, ProtectedPages } from '../../enums/pages.enum';
import { AppState } from '../../store/redux/interfaces';
import './Navbar.scss';
import React, { useState } from 'react';
import { Food as FoodIcon } from '@styled-icons/fluentui-system-regular/Food';
import { Carrot as CarrotIcon } from '@styled-icons/fa-solid/Carrot';
import { UserCircle as UserIcon } from '@styled-icons/boxicons-regular/UserCircle';
import { isMobile, useDeviceType } from '../../utils/useDeviceType';
import { MenuUnfold as MenuUnfoldIcon } from '@styled-icons/remix-fill/MenuUnfold';
import Menu from '../Menu';

const Navbar = () => {
  const deviceType = useDeviceType();
  const isMobileScreen = isMobile(deviceType);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );
  const { logoutReducer } = UserSlice.actions;
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mealsDropdownOpen, setMealsDropdownOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(true);

  const onLogOut = async () => {
    dispatch(logoutReducer());
    navigate(Pages.LOGIN);
  };

  const onProtectedLinkClick = async (path: string) => {
    if (user.id) {
      navigate(path);
    } else {
      toastr.info('Wow!', 'You need to create an account to visit this pages.');
    }
  };

  const mealsToggle = () => setMealsDropdownOpen(!mealsDropdownOpen);
  const productsToggle = () => setProductsDropdownOpen(!productsDropdownOpen);
  const userToggle = () => setUserDropdownOpen(!userDropdownOpen);
  const collapseToggle = () => setMenuCollapsed(!menuCollapsed);

  return (
    <Nav className={`navbar-header ${!menuCollapsed ? 'p-0' : ''} ${isMobileScreen && menuCollapsed ? 'mobile' : ''}`} justified>
      {isMobileScreen && (
        <>
          {menuCollapsed && (
            <>
              <NavItem className="d-flex link-item justify-content-start">
                <NavLink href={Pages.MAIN} className="logo">
                  <Logo title="Go to the main page" width="auto" />
                </NavLink>
              </NavItem>
              <NavItem className="d-flex link-item justify-content-end">
                <Button onClick={collapseToggle} className="btn-icon" color="secondary">
                  <div>
                    <MenuUnfoldIcon className="icon" width={20} height={20} />
                  </div>
                </Button>
              </NavItem>
            </>
          )}
          <Menu menuCollapsed={menuCollapsed} collapseToggle={collapseToggle} />
        </>
      )}
      {!isMobileScreen && (
        <>
          <NavItem className="link-item">
            <NavLink href={Pages.MAIN}>
              <Logo title="Go to the main page" width={120} />
            </NavLink>
          </NavItem>
          <Dropdown nav isOpen={mealsDropdownOpen} toggle={mealsToggle}>
            <DropdownToggle nav>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <span>Meals</span>
                <FoodIcon className="icon" width={20} height={20} />
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className="link-item">
                <NavLink href={Pages.MAIN}>Meals List</NavLink>
              </DropdownItem>
              <DropdownItem className="link-item">
                <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.MEALS_AVAILABLE_FOR_USER)}>Available Meals</NavLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem className="link-item">
                <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_MEAL)}>Create Meal</NavLink>
              </DropdownItem>
              <DropdownItem className="link-item">
                <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_MEAL_CATEGORY)}>Create Meals Category</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown nav isOpen={productsDropdownOpen} toggle={productsToggle}>
            <DropdownToggle nav>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <span>Products</span>
                <CarrotIcon className="icon" width={20} height={20} />
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className="link-item">
                <NavLink href={Pages.PRODUCTS}>Products List</NavLink>
              </DropdownItem>
              <DropdownItem className="link-item">
                <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.PROFILE)}>Available Products</NavLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem className="link-item">
                <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_PRODUCT)}>Create Product</NavLink>
              </DropdownItem>
              <DropdownItem className="link-item">
                <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_PRODUCT_CATEGORY)}>Create Products Category</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown nav isOpen={userDropdownOpen} toggle={userToggle}>
            <DropdownToggle nav>
              <div className="d-flex align-items-center justify-content-center gap-1">
                <UserIcon width={25} height={25} title="" />
              </div>
            </DropdownToggle>
            <DropdownMenu>
              {user.id && (
                <>
                  <DropdownItem className="link-item">
                    <NavLink href={ProtectedPages.PROFILE}>Profile</NavLink>
                  </DropdownItem>
                  <DropdownItem className="link-item">
                    <NavLink onClick={onLogOut} className="nav-link">
                      Log out
                    </NavLink>
                  </DropdownItem>
                </>
              )}
              {!user.id && (
                <>
                  <DropdownItem className="link-item">
                    <NavLink href={Pages.LOGIN}>Log in</NavLink>
                  </DropdownItem>
                  <DropdownItem className="link-item">
                    <NavLink href={Pages.REGISTRATION}>Sign up</NavLink>
                  </DropdownItem>
                </>
              )}
            </DropdownMenu>
          </Dropdown>
        </>
      )}
    </Nav>
  );
};

export default Navbar;
