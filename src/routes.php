<?php

$app->mount('/admin', function ($admin) {
    $admin->get('/', 'Admin\Controllers\DashboardController::index')->bind('admin_home');
    $admin->get('/contests', 'Admin\Controllers\ContestController::index')->bind('admin_contests');
    $admin->get('/ranking', 'Admin\Controllers\ContestController::ranking')->bind('admin_ranking');
    $admin->get('/participants', 'Admin\Controllers\ParticipantController::index')->bind('admin_participants');
    $admin->get('/images', 'Admin\Controllers\ImageController::index')->bind('admin_images');
    $admin->get('/images/import', 'Admin\Controllers\ImageController::import')->bind('admin_import_images');
});

$app->mount('/', function ($contest) {
    $contest->get('/', 'Contest\Controllers\IndexController::index');
    $contest->get('/contest/running', 'Contest\Controllers\ContestController::running');
    $contest->get('/contest/{contestId}/participant/{document}', 'Contest\Controllers\ParticipantController::index');
    $contest->post('/contest/{contestId}/participant/{document}/image/{imageId}', 'Contest\Controllers\ParticipantController::vote');
});