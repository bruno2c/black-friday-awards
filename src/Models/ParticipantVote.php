<?php

namespace Models;

class ParticipantVote extends AbstractModel
{
    public function getParticipantVotes($participantId)
    {
        $sql = "SELECT pv.* FROM participant_vote pv WHERE pv.participant_id = ?";
        return $this->db->fetchAll($sql, [(int) $participantId]);
    }

    public function checkParticipantVoteForImage($participantId, $imageId)
    {
        $sql = "SELECT pv.* FROM participant_vote pv WHERE pv.participant_id = ? AND pv.image_id = ?";
        $vote = $this->db->fetchAssoc($sql, [(int) $participantId, (int) $imageId]);

        return isset($vote['id']);
    }

    public function registerVote($participantId, $imageId)
    {
        return $this->db->insert('participant_vote', [
            'participant_id' => (int) $participantId,
            'image_id' => (int) $imageId,
            'created_at' => (new \DateTime())->format('Y-m-d H:i:s')
        ]);
    }
}