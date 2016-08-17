export class App {
  configureRouter(config, router) {
    config.title = 'Home';
    config.options.root = '/';
    config.map([
      { route: ['', 'home'],            name: 'home',         moduleId: './app/routes/home/home',               nav: false, title: 'Home'       },
      //{ route: 'archives',              name: 'archives',     moduleId: './app/routes/archives/archives',       nav: true, title: 'Archives'    },
      //{ route: 'archives/:year',        name: 'archives',     moduleId: './app/routes/archives/archives',       nav: true, title: 'Archives'    },
      //{ route: 'archives/:year/:month', name: 'archives',     moduleId: './app/routes/archives/archives',       nav: true, title: 'Archives'    },
      //{ route: 'categories',            name: 'categories',   moduleId: './app/routes/catagories/categories',   nav: true, title: 'Categories'  },
      //{ route: 'categories/:id',        name: 'categories',   moduleId: './app/routes/catagories/categories',   nav: true,                      },
      //{ route: 'post/:id',              name: 'post',         moduleId: './app/routes/post/post',               nav: true                       },
      //{ route: 'tags',                  name: 'tags',         moduleId: './app/routes/tags/tags',               nav: true, title: 'Tags'        },
      //{ route: 'tags/:id',              name: 'tags',         moduleId: './app/routes/tags/tags',               nav: true                       }
    ]);

    this.router = router;
  }
}
