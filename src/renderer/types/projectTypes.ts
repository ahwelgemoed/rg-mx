export type ProjectType = {
  name: string;
  lastModified: Date;
  folderNames: FolderNamesType[];
};
export type FolderNamesType = {
  name: string;
  lastModified: Date;
};

export enum FolderSortEnum {
  Smart = "1",
  Plain = "2",
  Sub = "3",
}
