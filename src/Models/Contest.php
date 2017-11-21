<?php

namespace Models;

class Contest extends AbstractModel
{
    const STATUS_CREATED = 'CREATED';
    const STATUS_RUNNING = 'RUNNING';
    const STATUS_FINALIZED = 'FINALIZED';

    public function find($contestId)
    {
        $sql = "SELECT c.* FROM contest c WHERE c.id = ?";
        return $this->db->fetchAssoc($sql, [(int) $contestId]);
    }

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
}