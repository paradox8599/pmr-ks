import { Client } from "./Client";
import { cmForm } from "./FormCM";
import { gsaForm } from "./FormGSA";
import { User } from "./User";
import { History } from "./History";
import { type Lists } from ".keystone/types";
import { Appendix } from "./Appendix";

export const lists: Lists = {
  User,
  Client,
  gsaForm,
  cmForm,
  Appendix,
  History,
};
