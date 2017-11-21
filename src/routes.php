<?php

$app->mount('/admin', function ($admin) {
    $admin->get('/', 'Admin\Controllers\DashboardController::index');
});

$app->mount('/', function ($contest) {
    $contest->get('/', 'Contest\Controllers\IndexController::index');
    $contest->get('/contest/running', 'Contest\Controllers\ContestController::running');
    $contest->get('/contest/{contestId}/participant/{document}', 'Contest\Controllers\ParticipantController::index');
    $contest->post('/contest/{contestId}/participant/{document}/image/{imageId}', 'Contest\Controllers\ParticipantController::vote');
});