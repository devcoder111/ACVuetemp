import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: () =>
        import(/* webpackChunkName: "about" */ "../views/Home.vue"),
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    //containercontext value is read or compose
    path: "/fileemail/:containercontext?/:connection?/:entity?/:entityid?/",
    name: "fileemail",
    component: () =>
      import(/* webpackChunkName: "fileemail" */ "../views/FileEmail/index"),
  },
  {
    path: "/history/:connection?/:entity?/:entityid?",
    name: "history",
    component: () =>
      import(/* webpackChunkName: "history" */ "../views/History/index"),
  },
  {
    path: "/parseemail/:connection?/:entity?/:entityid?",
    name: "parseemail",
    component: () =>
      import(/* webpackChunkName: "parseemail" */ "../views/ParseEmail/index"),
  },
  {
    path: "/timeline/:connection?/:entity?/:entityid?",
    name: "timeline",
    component: () =>
      import(/* webpackChunkName: "timeline" */ "../views/Timeline/index"),
  },
  {
    path: "/attachdocuments/:connection?/:entity?/:entityid?",
    name: "attachdocuments",
    component: () =>
      import(
        /* webpackChunkName: "attachdocuments" */ "../views/AttachDocuments/index"
      ),
  },
  {
    path: "/emailtemplates/:connection?/:entity?/:entityid?",
    name: "emailtemplates",
    component: () =>
      import(
        /* webpackChunkName: "emailtemplates" */ "../views/EmailTemplates/index"
      ),
  },
  {
    path: "/task/:connection?/:entity?/:entityid?",
    name: "task",
    component: () =>
      import(/* webpackChunkName: "task" */ "../views/Task/index"),
  },
  {
    path: "/logcall/:connection?/:entity?/:entityid?",
    name: "logcall",
    component: () =>
      import(/* webpackChunkName: "task" */ "../views/LogCall/index"),
  },
  {
    //containercontext=appointment/task/email....as in which inspector window
    path: "/addressbook/:connection?/:containercontext?",
    name: "addressbook",
    component: () =>
      import(
        /* webpackChunkName: "addressbook" */ "../views/AddressBook/index"
      ),
  },
  {
    //app is outlook or outlook365
    //container is explorer or inspector
    //containercontext is read or compose
    //searchstring is usually the first TO address...used in compose mode only
    //EG mytaskpane/outlook/inspector/compose/someone@domain.com
    path:
      "/mytaskpane/:app?/:container?/:containercontext?/:searchstring?/:otherinfo?",
    name: "mytaskpane",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "mytaskpane" */ "../views/MyTaskPane/index"
        ),
      
    },
  },
  {
    path: "/startup/:connectioncounts?",
    name: "startup",
    components: {
      default: () =>
        import(/* webpackChunkName: "startup" */ "../views/StartUp/index"),
     
    },
  },
  {
    path: "/firstrun",
    name: "firstrun",
    components: {
      default: () =>
        import(/* webpackChunkName: "startup" */ "../views/FirstRun/index"),
    },
  },
  {
    path: "/blanko",
    name: "blanko",
    components: {
      default: () =>
        import(/* webpackChunkName: "startup" */ "../views/BlankO/index"),
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "mytaskpane" */ "../views/MyTaskPane/index"
        ),
    },
  },
  {
    path: "/settings",
    name: "settings",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "mytaskpane" */ "../views/MyTaskPane/index"
        ),
    },
  },
  {
    path: "/login",
    name: "login",
    components: {
      default: () =>
        import(/* webpackChunkName: "mytaskpane" */ "../views/StartUp/index"),
    },
  },
  
  {
    path: "/mytaskpanemx/",
    name: "mytaskpanemx",
    components: {
      default: () =>
        import(
          /* webpackChunkName: "mytaskpanemx" */ "../views/MyTaskPaneMX/index"
        ),
    },
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;

/*
NOTES ON params

   path: '/mytaskpane/:app?/:container?/:containercontext?',
   app could be "outlook" (our vsto add in) or "owa" (office 365)
   container can be "explorer" or "inspector" (inspector is new email/appt ect window)
   containercontext can be "email", "appointment", "task"

   EG
   http://localhost:8080/#/mytaskpane/outlook/inspector/email

   

*/
