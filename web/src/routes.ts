import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    index("./components/MainGrid.tsx"),
] satisfies RouteConfig;
