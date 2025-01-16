import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router'
import NavService from '../Services/NavigationService'
import { p } from 'react-router/dist/development/fog-of-war-DLtn2OLr';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: (theme).palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const generateBreadCrumbs = (breadcrumbs: string[]) => {
    return breadcrumbs.map((item, index) => (
        <Typography key={index} variant="body1" sx={{ color: 'text.primary', fontWeight: index === breadcrumbs.length - 1 ? 600 : null }}>
            {capitalizeFirstLetter(item)}
        </Typography>
    ))
}

function headerView() {
    const path = useLocation().pathname;
    let pathArr = path.split("/").filter(item => item !== '');
    // const location = capitalizeFirstLetter(path.replace("/", ""));
    console.log(pathArr);
    return pathArr;
}

export default function NavbarBreadcrumbs() {
    let location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([""]);

    useEffect(() => {
        const path = location.pathname;
        let pathArr = path.split("/").filter(item => item !== '');
        const pageTitle = NavService.getPageTitle()
        if (pageTitle !== "") {
            pathArr[pathArr.length - 1] = pageTitle;
        }
        setBreadcrumbs(pathArr)
        document.title = `${pageTitle}`;
        NavService.setPageTitle("")
        console.log(breadcrumbs)
    }, [location]);

    return (
        <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
        >
            {/* <Typography variant="body1">Inventory</Typography> */}
            {breadcrumbs.map((item, index) => (
                <Typography key={index} variant="body1" sx={{ color: 'text.primary', fontWeight: index === breadcrumbs.length - 1 ? 600 : null }}>
                    {capitalizeFirstLetter(item)}
                </Typography>
            ))}
        </StyledBreadcrumbs>
    );
}
