export type MassSlot = {
  label: string;
  times: string[];
  note?: string;
};

export type ParishContact = {
  name: string;
  addressLines: string[];
  phone: string;
  mobile?: string;
  email: string;
  bankAccount?: string;
  mapUrl?: string;
};

export type Clergy = {
  role: string;
  name: string;
  phone?: string;
  email?: string;
};

export type OfficeHours = {
  summary: string;
  items: string[];
};

export type ParishGroup = {
  name: string;
  description: string;
  meeting?: string;
};

export type Devotion = {
  name: string;
  when: string;
};

export type UsefulLink = {
  label: string;
  href: string;
};

export type Parish = {
  name: string;
  shortName: string;
  patron: string;
  feastDay: string;
  erected: string;
  diocese: string;
  deanery: string;
  motto: string;
  contact: ParishContact;
  clergy: Clergy[];
  office: OfficeHours;
  masses: MassSlot[];
  confessions: string;
  groups: ParishGroup[];
  devotions: Devotion[];
  links: UsefulLink[];
  construction: {
    title: string;
    summary: string;
    accountNote?: string;
  };
};

export type ArticleKind = "aktualnosci" | "intencje";

export type ArticleMeta = {
  slug: string;
  kind: ArticleKind;
  title: string;
  date: string;
  filename: string;
  excerpt: string;
};

export type Article = ArticleMeta & {
  html: string;
};

export type GalleryImage = {
  filename: string;
  src: string;
  alt: string;
};

export type Album = {
  slug: string;
  title: string;
  date: string;
  description: string;
  cover?: string;
  images: GalleryImage[];
};

export type StaticPage = {
  slug: string;
  title: string;
  description?: string;
  html: string;
};
