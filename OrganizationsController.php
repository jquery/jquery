<?php

namespace backend\controllers;

use common\models\FederalDistrict;
use common\models\Municipality;
use Yii;
use common\models\Organization;
use common\models\TypeOrganization;
use common\models\OrganizationSearch;
use common\models\Region;
use common\models\User;
use yii\data\ActiveDataProvider;
use yii\web\Controller;
use yii\web\NotFoundHttpException;
use yii\filters\VerbFilter;
use yii\helpers\ArrayHelper;

/**
 * OrganizationsController implements the CRUD actions for Organization model.
 */
class OrganizationsController extends Controller
{
    /**
     * {@inheritdoc}
     */
    /*public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'delete' => ['POST'],
                ],
            ],
        ];
    }*/

    /**
     * Lists all Organization models.
     * @return mixed
     */
    public function actionIndex()
    {
        if(Yii::$app->user->can('admin')) {
            $searchModel = new OrganizationSearch();
            $search = Yii::$app->request->queryParams;
 
            $sub = array('' => 'Все ...');
            $sub_bd = ArrayHelper::map(TypeOrganization::find()->orderBy(['name'=> SORT_ASC])->all(), 'id', 'name');
            $sub = ArrayHelper::merge($sub,$sub_bd);
 
            $dataProvider = $searchModel->search($search);
            return $this->render('index', [
                'dataProvider' => $dataProvider,
                'searchModel' => $searchModel,
                'sub' => $sub,
            ]);
        }
        else{
            return $this->goHome();
        }
    }


    public function actionLogin($id){


        $model = User::find()->where(['organization_id' => $id, 'parent_id' => 0])->one();

        Yii::$app->user->login($model);

        return $this->redirect(['site/index']);
    }

    /**
     * Displays a single Organization model.
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
     * Creates a new Organization model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     * @return mixed
     */
    public function actionCreate()
    {
        $model = new Organization();
        $me = User::find()->where(['id' => Yii::$app->user->id])->one();
        $my_organization = Organization::findOne($me->organization_id);
        if(Yii::$app->user->can('rospotrebnadzor_camp') || Yii::$app->user->can('rospotrebnadzor_nutrition') || Yii::$app->user->can('subject_minobr') || Yii::$app->user->can('minobr')){
            if(empty(Yii::$app->session['organization_id'])){
                Yii::$app->session->setFlash('error', "Чтобы посмотреть информацию об организации, необходимо ее выбрать из списка");
                return $this->redirect(['site/index']);
            }
            $organization_id = Yii::$app->session['organization_id'];
            $my_organization = Organization::findOne($organization_id);
            $me = User::find()->where(['organization_id' => $my_organization->id])->one();
        }
        if(empty($my_organization)){
            Yii::$app->session->setFlash('error', "Прозишла проблема при регистрации. У вас отсутствует организация");
            return $this->redirect(['site/index']);
        }

        if(Yii::$app->request->post()){
            /*print_r(Yii::$app->request->post());
            exit;*/
            $model2 = $this->findModel($my_organization->id);
            /*Yii::$app->request->post()['Organization']['date_sez_build'] = strtotime(Yii::$app->request->post()['Organization']['date_sez_build']);
            */
            /*print_r(Yii::$app->request->post());exit;*/
            /*var_dump($model2->attributes);
            exit;*/
            //if($model2->validate()) { print_r('ok'); exit;}
            if ($model2->load(Yii::$app->request->post()) && $model2->save(false))
            {
                Yii::$app->session->setFlash('success', "Данные сохранены");
                return $this->redirect(['create']);
            }
        }

        return $this->render('create', [
            'me' => $me,
            'my_organization' => $my_organization,
            'model' => $model,
        ]);
    }

    public function actionRospotrebOrg()
    {
        $regions = Region::find()->all();
        foreach ($regions as $region){
            $model = new Organization();
            $model->title = 'Роспотребнадзор';
            $model->federal_district_id = $region->district_id;
            $model->region_id = $region->id;
            $model->type_org = 7;
            $model->status = 7;
            $model->save();
            //exit;
        }
        return $this->redirect(['index']);
    }

    /**
     * Updates an existing Organization model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id
     * @return mixed
     * @throws NotFoundHttpException if the model cannot be found
     */
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);

        if ($model->load(Yii::$app->request->post()) && $model->save()) {
            return $this->redirect(['view', 'id' => $model->id]);
        }

        return $this->render('create', [
            'model' => $model,
        ]);
    }

    /**
     * Deletes an existing Organization model.
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
     * Finds the Organization model based on its primary key value.
     * If the model is not found, a 404 HTTP exception will be thrown.
     * @param integer $id
     * @return Organization the loaded model
     * @throws NotFoundHttpException if the model cannot be found
     */
    protected function findModel($id)
    {
        if (($model = Organization::findOne($id)) !== null) {
            return $model;
        }

        throw new NotFoundHttpException('The requested page does not exist.');
    }

    public function actionSearch($id)
    {
        $groups = Region::find()->where(['district_id'=>$id])->all();
        $json = array();
        if(!empty($groups)){
            $json .= '<option value="0">Все</option>';
            foreach ($groups as $key => $group) {
                $json .= "<option value='{$group->id}'>{$group->name}</option>";
            }
        }
        else {
            $json .= '<option value="0">Все</option>';
        }
        return $json;
    }
    public function actionSearchMunicipality($id)
    {
        $groups = Municipality::find()->where(['region_id'=>$id])->all();
        $json = array();
        if(!empty($groups)){
            $json .= '<option value="0">Все</option>';
            foreach ($groups as $key => $group) {
                $json .= "<option value='{$group->id}'>{$group->name}</option>";
            }
        }
        else {
            $json .= '<option value="0">Все</option>';
        }
        return $json;
    }
}
