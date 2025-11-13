interface Member {
  name: string;
  image?: string;
}

export interface ClassMemberResponse {
  students: Member[];
  teacher: Member[];
}
