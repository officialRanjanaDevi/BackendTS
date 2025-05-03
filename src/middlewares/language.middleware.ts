import { Request, Response, NextFunction } from "express";

export enum LanguageSupport {
  english = "en"
}

export function languageCheckUp(req: Request, _res: Response, next: NextFunction) {
  const language = req.headers["content-language"];
  const language_support_in_systems: string[] = [...Object.values(LanguageSupport)];
  if (language) {
    if (!language_support_in_systems.includes(language)) req.headers["content-language"] = LanguageSupport.english;
  } else {
    req.headers["content-language"] = LanguageSupport.english;
  }
  next();
}
