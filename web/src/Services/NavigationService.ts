let pageTitle = "";
let loading: boolean = false;

const NavService = {
    loading: loading,
    pageTitle: pageTitle,
    setPageTitle: (title: string) => {
        pageTitle = title;
    },
    getPageTitle: () => {
        return pageTitle;
    },
    setLoading: (l: boolean) => {
        loading = l;
    },
    getLoading: () => {
        return loading;
    }
};

export default NavService;
