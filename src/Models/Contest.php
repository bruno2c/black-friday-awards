<?php

namespace Models;

class Contest extends AbstractModel
{
    public $table = 'contest';

    const STATUS_CREATED = 'CREATED';
    const STATUS_RUNNING = 'RUNNING';
    const STATUS_FINALIZED = 'FINALIZED';

    public function findOneRunning()
    {
        $sql = "SELECT c.* FROM contest c WHERE c.status = ?";
        return $this->db->fetchAssoc($sql, [self::STATUS_RUNNING]);
    }

    public function calcRemainingVotesByParticipant($contestId, $participantVotes)
    {
        $contest = $this->find($contestId);

        if (!$contest) {
            throw new \Exception('Concurso não encontrado');
        }

        return $contest['max_votes'] ? $contest['max_votes'] - $participantVotes : 0;
    }

    public function getRanking($contestId)
    {
        $sql = "SELECT 
                    p.name, COUNT(pv.id) total_votes
                FROM
                    contest c
                JOIN
                    image i ON i.contest_id = c.id
                JOIN
                    participant_vote pv ON pv.image_id = i.id
                WHERE
                    c.id = ?
                GROUP BY i.id
                ORDER BY COUNT(pv.id) ASC";

        return $this->db->fetchAll($sql, [$contestId]);
    }
}