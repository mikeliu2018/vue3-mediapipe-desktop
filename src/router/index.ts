import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores";
import { useToast, POSITION } from "vue-toastification";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      component: HomeView,
      // anybody can read a post
      meta: { requiresAuth: false },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
      // anybody can read a post
      meta: { requiresAuth: false },
    },
    {
      path: "/pose",
      name: "pose",
      component: () => import("../views/PoseView.vue"),
      // only authenticated users can create posts
      meta: { requiresAuth: true },
    },
    {
      path: "/hands",
      name: "hands",
      component: () => import("../views/HandsView.vue"),
      // only authenticated users can create posts
      meta: { requiresAuth: true },
    },
    {
      path: "/holistic",
      name: "holistic",
      component: () => import("../views/HolisticView.vue"),
      // only authenticated users can create posts
      meta: { requiresAuth: true },
    },
    {
      path: "/face-mesh",
      name: "face-mesh",
      component: () => import("../views/FaceMeshView.vue"),
      // only authenticated users can create posts
      meta: { requiresAuth: true },
    },
    {
      path: "/face-detection",
      name: "face-detection",
      component: () => import("../views/FaceDetectionView.vue"),
      // only authenticated users can create posts
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useAuthStore();
  const toast = useToast();

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    toast.info("Please log in.", {
      position: POSITION.BOTTOM_RIGHT,
    });
    return {
      path: "/",
      // save the location we were at to come back later
      query: { redirect: to.fullPath },
    };
  }
});

export default router;
