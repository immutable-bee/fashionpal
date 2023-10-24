import { Notifier } from "@airbrake/browser";

export function error(err, info = "") {
  const airbrake = new Notifier({
    environment: process.env.NEXTAUTH_URL,
    projectId: parseInt(process.env.AIR_BREAK_PROJECT_ID || "0"),
    projectKey: process.env.AIR_BREAK_PROJECT_KEY || "",
  });

  airbrake
    .notify({
      error: err,
      params: { info: info },
    })
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
}
