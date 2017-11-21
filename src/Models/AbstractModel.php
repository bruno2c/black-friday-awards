<?php

namespace Models;

use Silex\Application;

abstract class AbstractModel
{
    protected $db;

    public function __construct(Application $app)
    {
        $this->db = $app['db'];
    }

    public function find($id)
    {
        $sql = sprintf("SELECT * FROM %s WHERE id = ?", $this->table);
        return $this->db->fetchAssoc($sql, [(int) $id]);
    }

    public function findAll()
    {
        $sql = sprintf("SELECT * FROM %s", $this->table);
        return $this->db->fetchAll($sql);
    }
}