'use strict';
import PageTitle from './web-components/page-title.js';
import Navbar from './web-components/navbar.js';
import ImageFigure from './web-components/image-figure.js';
import SearchBar from './web-components/search-bar.js';
import PagerButtons from './web-components/pager-buttons.js';
import router from './routes.js';
import RouteResolver from './route-resolver.js';

const routeResolver = new RouteResolver(router);