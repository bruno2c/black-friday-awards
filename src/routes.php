<?php

$app->mount('/admin', function ($admin) {
    $admin->get('/', 'Admin\Controllers\DashboardController::index')->bind('admin_home');
    $admin->get('/contests', 'Admin\Controllers\ContestController::index')->bind('admin_contests');
    $admin->get('/ranking', 'Admin\Controllers\ContestController::ranking')->value('contestId', null)->bind('admin_ranking');
    $admin->get('/ranking/{contestId}', 'Admin\Controllers\ContestController::ranking')->bind('admin_ranking_filter');
    $admin->get('/participants', 'Admin\Controllers\ParticipantController::index')->bind('admin_participants');
    $admin->get('/images', 'Admin\Controllers\ImageController::index')->bind('admin_images');
    $admin->post('/images/import', 'Admin\Controllers\ImageController::import')->bind('admin_import_images');
});

$app->mount('/', function ($contest) {
    $contest->get('/', 'Contest\Controllers\IndexController::index');
    $contest->get('/vote/contest/{contestId}', 'Contest\Controllers\IndexController::index');
    $contest->match('/contest/running', 'Contest\Controllers\ContestController::running');
    $contest->match('/contest/vote', 'Contest\Controllers\ParticipantController::vote');
    $contest->match('/contest/{contestId}', 'Contest\Controllers\ContestController::index');
    $contest->match('/contest/{contestId}/winners', 'Contest\Controllers\ContestController::winners');
    $contest->match('/contest/{contestId}/participant/{document}', 'Contest\Controllers\ParticipantController::index');
    $contest->get('/admin_login', 'Admin\Controllers\LoginController::index')->bind('admin_login');
});

$app->get('/images/{file}', function ($file) use ($app) {
    if (!file_exists(__DIR__.'/images/'.$file)) {
        return $app->abort(404, 'The image was not found.');
    }

    $stream = function () use ($file) {
        readfile($file);
    };

    return $app->stream($stream, 200, array('Content-Type' => 'image/png'));
});