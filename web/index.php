<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

require_once __DIR__.'/../src/routes.php';
require_once __DIR__.'/../app/db.php';
require_once __DIR__.'/../app/filesystem.php';

define('BASE_PATH', __DIR__ . '/../');
define('APP_PATH', __DIR__ . '/../app');

$app['debug'] = true;

$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => [
        __DIR__.'/../src/Contest/Resources/views',
        __DIR__.'/../src/Admin/Resources/views',
    ]
));

$app->register(new Silex\Provider\DoctrineServiceProvider(), array(
    'db.options' => $db,
));

$app->register(new Silex\Provider\AssetServiceProvider(), array(
    'assets.version' => 'v1',
    'assets.version_format' => '%s?version=%s'
));

$app->register(new Silex\Provider\SessionServiceProvider());

$app->register(new Silex\Provider\SecurityServiceProvider(), array(
    'security.firewalls' => [
        'admin' => array(
            'pattern' => '^/admin/',
            'http' => true,
            'form' => array('login_path' => '/admin_login', 'check_path' => '/admin/login_check'),
            'users' => array(
                // raw password is foo
                'rocket' => array('ROLE_ADMIN', '$2y$10$dIiI3/WZRWcfY/f.z/XKI.w9j3o0zLbZQjvJOZ58ATj/oDMEEEooi'),
            ),
        ),
    ]
));

$app['config.filesystem'] = $filesystem;

$app->run();