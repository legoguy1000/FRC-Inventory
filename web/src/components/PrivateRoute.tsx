// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import { Component } from 'react'
import AuthService from '../Services/AuthService'
import { Navigate, Route, PathRouteProps } from 'react-router'

const PrivateRoute: Route = ({ component, ...rest }) => {
    // Add your own authentication on the below line.
    const isLoggedIn = AuthService.isLoggedIn()

    const render = (props: PathRouteProps) => {
        if (isLoggedIn) {
            return <Component {...props} />;
        } else {
            return <Navigate to="/login" replace={true} />
        }
    }
    return (
        <Route
            {...rest}
            render={render(props)}
        />
    ):
}

export default PrivateRoute
