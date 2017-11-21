<?php

namespace Contest\Controllers;

use Models\Contest;
use Models\Image;
use Models\Participant;
use Models\ParticipantVote;
use Silex\Application;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ParticipantController
{
    public function index($contestId, $document, Application $app)
    {
        $response = [];

        try {

            $participantModel = new Participant($app);
            $participant = $participantModel->findOneByDocument($document);

            if (!$participant) {
                throw new \Exception('Participante não cadastrado');
            }

            $participantVoteModel = new ParticipantVote($app);
            $votes = $participantVoteModel->getParticipantVotes($participant['id']);
            $totalVotes = count($votes);

            $contestModel = new Contest($app);
            $remainingVotes = $contestModel->calcRemainingVotesByParticipant($contestId, $totalVotes);

            $response = [
                'code' => Response::HTTP_OK,
                'participant' => $participant,
                'votes' => $votes,
                'total_votes' => $totalVotes,
                'remaining_votes' => $remainingVotes
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }

    public function vote($contestId, $document, $imageId, Application $app)
    {
        $response = [];

        try {

            $participantModel = new Participant($app);
            $participant = $participantModel->findOneByDocument($document);

            if (!$participant) {
                throw new \Exception('Participante não cadastrado');
            }

            $participantVoteModel = new ParticipantVote($app);
            $votes = $participantVoteModel->getParticipantVotes($participant['id']);
            $totalVotes = count($votes);

            $contestModel = new Contest($app);
            $remainingVotes = $contestModel->calcRemainingVotesByParticipant($contestId, $totalVotes);

            if ($remainingVotes < 1) {
                throw new \Exception('Voto não registrado: Número máximo de votos excedido');
            }

            $imageModel = new Image($app);
            $image = $imageModel->find($imageId);

            if (!$image) {
                throw new \Exception('Imagem não encontrada');
            }

            $imageAlreadyVoted = $participantVoteModel->checkParticipantVoteForImage($participant['id'], $imageId);

            if ($imageAlreadyVoted) {
                throw new \Exception(sprintf('Você já votou na imagem %s', $imageId));
            }

            $participantVoteModel->registerVote($participant['id'], $imageId);

            $response = [
                'code' => Response::HTTP_OK,
                'message' => 'Voto registrado com sucesso!'
            ];
        } catch (\Exception $e) {
            $response['code'] = Response::HTTP_BAD_REQUEST;
            $response['message'] = $e->getMessage();
        }

        return new JsonResponse($response);
    }
}