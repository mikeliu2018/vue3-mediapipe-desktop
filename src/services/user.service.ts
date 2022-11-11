import { useAuthStore } from "@/stores";

export class UserService {
  private static verifyIdTokenUrl = "/api/login-with-google";

  public static isLoggedIn() {
    const store = useAuthStore();
    return store.isLoggedIn;
  }

  public static async loginWithGoogle(clientId: string, idToken: string) {
    // verify from backend
    const result = await fetch(this.verifyIdTokenUrl, {
      body: JSON.stringify({
        clientId: clientId,
        idToken: idToken,
      }), // must match 'Content-Type' header
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // *client, no-referrer
    });
    // output to json
    return result.json();
  }
}
