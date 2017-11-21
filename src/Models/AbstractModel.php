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
}