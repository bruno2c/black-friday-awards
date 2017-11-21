<?php

namespace Models;

class Image extends AbstractModel
{
    public function find($imageId)
    {
        $sql = "SELECT i.* FROM image i WHERE i.id = ?";
        return $this->db->fetchAssoc($sql, [(int) $imageId]);
    }

    public function findByContest($contestId)
    {
        $sql = "SELECT i.* FROM image i WHERE i.contest_id = ?";
        return $this->db->fetchAssoc($sql, [(int) $contestId]);
    }
}