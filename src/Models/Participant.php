<?php

namespace Models;

class Participant extends AbstractModel
{
    public function findOneByDocument($document)
    {
        $sql = "SELECT p.* FROM participant p WHERE p.document = ?";
        return $this->db->fetchAssoc($sql, [(int) $document]);
    }
}