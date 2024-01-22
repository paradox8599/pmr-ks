import { Client } from "./Client";
import { cmForm } from "./FormCM";
import { gsaForm } from "./FormGSA";
import { Image } from "./Image";
import { User } from "./User";
import { type Lists } from ".keystone/types";

export const lists: Lists = {
  User,
  Client,
  gsaForm,
  cmForm,
  Image,
};
