import { User } from "./User";
import { Client } from "./Client";
import { Image } from "./Image";
import { gsaForm } from "./FormGSA";
import { cmForm } from "./FormCM";
import { type Lists } from ".keystone/types";

export const lists: Lists = {
  User,
  Client,
  gsaForm,
  cmForm,
  Image,
};
