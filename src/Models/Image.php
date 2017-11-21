<?php

namespace Models;

class Image extends AbstractModel
{
    public $table = 'image';

    public function find($imageId)
    {
        $sql = "SELECT i.* FROM image i WHERE i.id = ?";
        return $this->db->fetchAssoc($sql, [(int) $imageId]);
    }

    public function findByContest($contestId)
    {
        $sql = "SELECT i.* FROM image i WHERE i.contest_id = ?";
        return $this->db->fetchAll($sql, [(int) $contestId]);
    }

    public function findAllWithRelatedData()
    {
        $sql = "SELECT i.*, c.name contest_name, p.name participant_name FROM image i
                LEFT JOIN participant p ON p.id = i.owner_id
                JOIN contest c ON c.id = i.contest_id";

        return $this->db->fetchAll($sql);
    }

    public function insert($contestId, $path, $url)
    {
        return $this->db->insert('image', [
            'contest_id' => (int) $contestId,
            'path' => $path,
            'url' => $url
        ]);
    }
}