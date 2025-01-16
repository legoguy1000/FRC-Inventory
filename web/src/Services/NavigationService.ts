let pageTitle = "";

const NavService = {
    setPageTitle: (title: string) => {
        pageTitle = title;
    },
    getPageTitle: () => {
        return pageTitle;
    }
};

export default NavService;
