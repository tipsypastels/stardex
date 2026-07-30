export type PBSFormBucket = PBSFormBucketByFormName | PBSFormBucketByLine;

export interface PBSFormBucketByFormName {
  groupedBy: "formName";
}

export interface PBSFormBucketByLine {
  groupedBy: "line";
}
