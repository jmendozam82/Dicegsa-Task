export interface Meeting {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface MeetingParticipant {
  meeting_id: string;
  user_id: string;
}

export interface CreateMeetingInput {
  title: string;
  description?: string;
  participant_ids: string[];
}
