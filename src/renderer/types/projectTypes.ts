export type ProjectType = {
  name: string;
  lastModified: Date;
  folderNames: FolderNamesType[];
};
export type FolderNamesType = {
  name: string;
  lastModified: Date;
};
