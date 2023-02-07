import React from 'react';
import { useNavigate } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button, NavItem, NavLink } from 'reactstrap';
import { ReactComponent as Logo } from './logo.svg';
import { UserSlice } from '../../store';
import { Pages, ProtectedPages } from '../../enums/pages.enum';
import { AppState } from '../../store/redux/interfaces';
import './Menu.scss';
import { toastr } from 'react-redux-toastr';
import { MenuFold as MenuFoldIcon } from '@styled-icons/remix-fill/MenuFold';

const Menu = ({ menuCollapsed, collapseToggle }: MenuProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: AppState) => ({
      user: state.user,
    }),
    shallowEqual
  );
  const { logoutReducer } = UserSlice.actions;

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

  return (
    <>
      {!menuCollapsed && (
        <NavItem className="d-flex flex-column menu justify-content-between" justified vertical>
          <div className="menu-close-btn">
            <Button onClick={collapseToggle} className="btn-icon" color="secondary">
              <div>
                <MenuFoldIcon className="icon" width={20} height={20} />
              </div>
            </Button>
          </div>
          <NavItem className="link-item">
            <NavLink href={Pages.MAIN}>
              <Logo title="Go to the main page" width={120} />
            </NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink href={Pages.MAIN}>Meals List</NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.MEALS_AVAILABLE_FOR_USER)}>Available Meals</NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_MEAL)}>Create Meal</NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_MEAL_CATEGORY)}>Create Meal Category</NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink href={Pages.PRODUCTS}>Products List</NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.PROFILE)}>Available Products</NavLink>
          </NavItem>
          <NavItem className="link-item">
            <NavLink onClick={() => onProtectedLinkClick(ProtectedPages.CREATE_PRODUCT)}>Create Product</NavLink>
          </NavItem>
          {user.id && (
            <>
              <NavItem className="link-item">
                <NavLink href={ProtectedPages.PROFILE}>Profile</NavLink>
              </NavItem>
              <NavItem className="link-item">
                <NavLink onClick={onLogOut} className="nav-link">
                  Log out
                </NavLink>
              </NavItem>
            </>
          )}
          {!user.id && (
            <>
              <NavItem className="link-item">
                <NavLink href={Pages.LOGIN}>Log in</NavLink>
              </NavItem>
              <NavItem className="link-item">
                <NavLink href={Pages.REGISTRATION}>Sign up</NavLink>
              </NavItem>
            </>
          )}
        </NavItem>
      )}
    </>
  );
};

type MenuProps = {
  menuCollapsed: boolean;
  collapseToggle: () => void;
};

export default Menu;
