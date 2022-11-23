import { createRouter, createWebHistory } from "vue-router";
import ConnectComponent from "../components/ConnectComponent.vue"
import GameComponent from "../components/GameComponent.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "connect",
      component: ConnectComponent,
    },
    {
      path: "/play",
      name: "game",
      component: GameComponent,
    },
  ],
});

export default router;
