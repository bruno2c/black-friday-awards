<?php

namespace Contest\Controllers;

use Models\Contest;
use Models\Image;
use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ContestController
{
    public function running(Application $app)
    {
        $response = [];

        try {
            $contestModel = new Contest($app);
            $contest = $contestModel->findOneRunning();

            if (!$contest) {
                throw new \Exception('Nenhum concurso está acontecendo no momento');
            }

            $imageModel = new Image($app);
            $images = $imageModel->findByContest($contest['id']);

            $response = [
                'code' => Response::HTTP_OK,
                'contest' => $contest,
                'images' => $images,
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }

    public function index($contestId, Application $app)
    {
        $response = [];

        try {
            $contestModel = new Contest($app);
            $contest = $contestModel->find($contestId);

            if (!$contest) {
                throw new \Exception('Concurso não encontrado');
            }

            $imageModel = new Image($app);
            $images = $imageModel->findByContest($contest['id']);

            $response = [
                'code' => Response::HTTP_OK,
                'contest' => $contest,
                'images' => $images,
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }

    public function winners($contestId = null, Application $app)
    {
        $response = [];

        try {
            $contestModel = new Contest($app);
            $ranking = $contestModel->getWinners($contestId);

            $response = [
                'code' => Response::HTTP_OK,
                'ranking' => $ranking
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }

}