<?php

namespace backend\controllers;

use Yii;
use common\models\PlanInfCamp;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;

/**
 * PlanInfCampController implements the CRUD actions for PlanInfCamp model.
 */
class PlanInfCampController extends Controller
{
    /**
     * {@inheritdoc}
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }

    /**
     * Lists all PlanInfCamp models.
     * @return mixed
     */
    public function actionIndex()
    {
        $dataProvider = new ActiveDataProvider([
            'query' => PlanInfCamp::find(),
        ]);

        return $this->render('index', [
            'dataProvider' => $dataProvider,
        ]);
    }

    /**
     * Displays a single PlanInfCamp model.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionView($id)
    {
        return $this->render('view', [
            'model' => $this->findModel($id),
        ]);
    }

    /**
     * Creates a new PlanInfCamp model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model2 = new PlanInfCamp();
        if (Yii::$app->request->post())
        {
            $year = Yii::$app->request->post()['PlanInfCamp']['year'];
            $season = Yii::$app->request->post()['PlanInfCamp']['season'];
            $change = Yii::$app->request->post()['PlanInfCamp']['change'];
            $organization_id = Yii::$app->user->identity->organization_id;

            if(Yii::$app->user->can('rospotrebnadzor_camp')){
                $organization_id = Yii::$app->session['organization_id'];
            }

            //print_r($year);
            $id = PlanInfCamp::find()->where(['year' => $year,
                'season' => $season,
                'organization_id' => $organization_id,
                'change' => $change,
            ])->one()->id;

            if (!empty($id))
            {
                $model1 = $this->findModel($id);
            }
            else
            {
                $model1 = new PlanInfCamp();
            }

            $identificator = Yii::$app->request->post()['identificator'];

            if ($identificator == "save")
            {
                $post = Yii::$app->request->post()['PlanInfCamp'];
                //print_r($post['year']);
                $model1->organization_id = $organization_id;
                $model1->year = $post['year'];
                $model1->season = $post['season'];
                $model1->change = $post['change'];
                $model1->start_date = $post['start_date'];
                $model1->expiry_date = $post['expiry_date'];
                $model1->quantity_plan = $post['quantity_plan'];

                $model1->save(false);

                Yii::$app->session->setFlash('success', "Планируемая информация успешно добавлена");
                return $this->render('create', [
                    'model2' => $model2,
                    'year' => $year,
                    'season' => $season,
                    'change' => $change,
                ]);
            }
            else
            {
                return $this->render('create', [
                    'model' => $model1,
                    'model2' => $model2,
                    'year' => $year,
                    'season' => $season,
                    'change' => $change,
                ]);
            }
        }
        return $this->render('create', [
            'model2' => $model2,
        ]);
    }

    /**
     * Updates an existing PlanInfCamp model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save())
        {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('update', [
            'model' => $model,
        ]);
    }

    /**
     * Deletes an existing PlanInfCamp model.
     * If deletion is successful, the browser will be redirected to the 'index' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionDelete($id)
    {
        $this->findModel($id)->delete();

        return $this->redirect(['index']);
    }

    /**
     * Finds the PlanInfCamp model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return PlanInfCamp the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = PlanInfCamp::findOne($id)) !== null)
        {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }
}
